import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TabsSection() {
	return (
		<Tabs defaultValue='balanced' className='w-full'>
			<TabsList className='grid w-full grid-cols-3 mb-4'>
				<TabsTrigger value='balanced' data-preset='balanced'>
					Balanced
				</TabsTrigger>
				<TabsTrigger value='conversion' data-preset='conversion'>
					Conversion
				</TabsTrigger>
				<TabsTrigger value='revenue' data-preset='revenue'>
					Revenue
				</TabsTrigger>
			</TabsList>
		</Tabs>
	)
}
